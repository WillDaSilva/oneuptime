import Includes from "Common/Types/BaseDatabase/Includes";
import SortOrder from "Common/Types/BaseDatabase/SortOrder";
import { LIMIT_PER_PROJECT } from "Common/Types/Database/LimitMax";
import { PromiseVoidFunction } from "Common/Types/FunctionTypes";
import ObjectID from "Common/Types/ObjectID";
import { ModelEventType } from "Common/Utils/Realtime";
import ErrorMessage from "CommonUI/src/Components/ErrorMessage/ErrorMessage";
import LogsViewer from "CommonUI/src/Components/LogsViewer/LogsViewer";
import API from "CommonUI/src/Utils/API/API";
import AnalyticsModelAPI, {
  ListResult,
} from "CommonUI/src/Utils/AnalyticsModelAPI/AnalyticsModelAPI";
import Query from "CommonUI/src/Utils/BaseDatabase/Query";
import Select from "CommonUI/src/Utils/BaseDatabase/Select";
import ProjectUtil from "CommonUI/src/Utils/Project";
import Realtime from "CommonUI/src/Utils/Realtime";
import Log from "Common/AppModels/AnalyticsModels/Log";
import React, { FunctionComponent, ReactElement, useEffect } from "react";

export interface ComponentProps {
  id: string;
  telemetryServiceIds?: Array<ObjectID> | undefined;
  enableRealtime?: boolean;
  traceIds?: Array<string> | undefined;
  spanIds?: Array<string> | undefined;
  showFilters?: boolean | undefined;
  noLogsMessage?: string | undefined;
}

const DashboardLogsViewer: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  const query: Query<Log> = {};

  if (props.telemetryServiceIds && props.telemetryServiceIds.length > 0) {
    query.serviceId = new Includes(props.telemetryServiceIds);
  }

  if (props.traceIds && props.traceIds.length > 0) {
    query.traceId = new Includes(props.traceIds);
  }

  if (props.spanIds && props.spanIds.length > 0) {
    query.spanId = new Includes(props.spanIds);
  }

  const [logs, setLogs] = React.useState<Array<Log>>([]);
  const [error, setError] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [filterOptions, setFilterOptions] = React.useState<Query<Log>>(query);

  const select: Select<Log> = {
    body: true,
    time: true,
    projectId: true,
    serviceId: true,
    spanId: true,
    traceId: true,
    severityText: true,
    attributes: true,
  };

  type GetQueryFunction = () => Query<Log>;

  const getQuery: GetQueryFunction = (): Query<Log> => {
    return filterOptions;
  };

  useEffect(() => {
    fetchItems().catch((err: unknown) => {
      setError(API.getFriendlyMessage(err));
    });
  }, [filterOptions]);

  const fetchItems: PromiseVoidFunction = async (): Promise<void> => {
    setError("");
    setIsLoading(true);

    try {
      const listResult: ListResult<Log> = await AnalyticsModelAPI.getList<Log>({
        modelType: Log,
        query: getQuery(),
        limit: LIMIT_PER_PROJECT,
        skip: 0,
        select: select,
        sort: {
          time: SortOrder.Descending,
        },
        requestOptions: {},
      });

      // reverse the logs so that the newest logs are at the bottom
      listResult.data.reverse();

      setLogs(listResult.data);
    } catch (err) {
      setError(API.getFriendlyMessage(err));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!props.enableRealtime) {
      return;
    }

    const disconnectFunction: () => void = Realtime.listenToAnalyticsModelEvent(
      {
        modelType: Log,
        query: {},
        eventType: ModelEventType.Create,
        tenantId: ProjectUtil.getCurrentProjectId()!,
        select: select,
      },
      (model: Log) => {
        setLogs((logs: Array<Log>) => {
          return [...logs, model];
        });
      },
    );

    return () => {
      disconnectFunction();
    };
  }, []);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div id={props.id}>
      <LogsViewer
        isLoading={isLoading}
        onFilterChanged={(filterOptions: Query<Log>) => {
          setFilterOptions(filterOptions);
        }}
        filterData={filterOptions}
        logs={logs}
        showFilters={props.showFilters}
        noLogsMessage={props.noLogsMessage}
      />
    </div>
  );
};

export default DashboardLogsViewer;
