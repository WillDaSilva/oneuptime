import DatabaseCommonInteractionProps from "Common/Types/BaseDatabase/DatabaseCommonInteractionProps";
import ObjectID from "Common/Types/ObjectID";
import User from "Common/AppModels/Models/User";

export default interface DeleteById {
  id: ObjectID;
  deletedByUser?: User;
  props: DatabaseCommonInteractionProps;
}
