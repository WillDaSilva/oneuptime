import React, { Component } from 'react';
import ShouldRender from '../basic/ShouldRender';
import ClickOutside from 'react-click-outside';
import PropTypes from 'prop-types';
import { FormLoader } from '../basic/Loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { runScript, fetchAutomatedScript } from '../../actions/automatedScript';
import { history } from '../../store';

class RunAutomationScript extends Component {
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyBoard);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyBoard);
    }

    handleKeyBoard = e => {
        switch (e.key) {
            case 'Escape':
                return this.props.closeThisDialog();
            case 'Enter':
                return this.runScript();
            default:
                return false;
        }
    };

    runScript = () => {
        const {
            data: { automatedScriptId, projectId },
            runScript,
            fetchAutomatedScript,
            closeThisDialog,
        } = this.props;
        runScript(projectId, automatedScriptId).then(() => {
            fetchAutomatedScript(projectId, 0, 10);
            const pathName = history.location.pathname;
            history.push({
                pathname: `${pathName}/${this.props.data.automatedSlug}`,
            });
            closeThisDialog();
        });
    };
    render() {
        const { closeThisDialog } = this.props;
        const isRequesting = false,
            deleteError = null;
        return (
            <div className="ModalLayer-wash Box-root Flex-flex Flex-alignItems--flexStart Flex-justifyContent--center">
                <div
                    className="ModalLayer-contents"
                    tabIndex={-1}
                    style={{ marginTop: 40 }}
                >
                    <div className="bs-BIM">
                        <div className="bs-Modal bs-Modal--medium">
                            <ClickOutside onClickOutside={closeThisDialog}>
                                <div className="bs-Modal-header">
                                    <div className="bs-Modal-header-copy">
                                        <span className="Text-color--inherit Text-display--inline Text-fontSize--20 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                            <span>Run Script</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="bs-Modal-content">
                                    <span className="Text-color--inherit Text-display--inline Text-fontSize--14 Text-fontWeight--regular Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                        Do you want to run this script ?
                                    </span>
                                </div>
                                <div className="bs-Modal-footer">
                                    <div
                                        className="bs-Modal-footer-actions"
                                        style={{ width: 280 }}
                                    >
                                        <ShouldRender
                                            if={!isRequesting && deleteError}
                                        >
                                            <div
                                                id="deleteError"
                                                className="bs-Tail-copy"
                                            >
                                                <div
                                                    className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--row Flex-justifyContent--flexStart"
                                                    style={{
                                                        marginTop: '10px',
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                    }}
                                                >
                                                    <div className="Box-root Margin-right--8">
                                                        <div className="Icon Icon--info Icon--color--red Icon--size--14 Box-root Flex-flex"></div>
                                                    </div>
                                                    <div className="Box-root">
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        >
                                                            {deleteError}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </ShouldRender>
                                    </div>
                                    <div className="bs-Modal-footer-actions">
                                        <button
                                            className="bs-Button bs-DeprecatedButton bs-Button--grey btn__modal"
                                            type="button"
                                            onClick={closeThisDialog}
                                            id="cancelDeleteAnnouncementBtn"
                                        >
                                            <span>Cancel</span>
                                            <span className="cancel-btn__keycode">
                                                Esc
                                            </span>
                                        </button>
                                        <button
                                            id="deleteAnnouncementModalBtn"
                                            className="bs-Button bs-DeprecatedButton bs-Button--blue btn__modal"
                                            type="button"
                                            onClick={this.runScript}
                                            disabled={isRequesting}
                                            autoFocus={true}
                                        >
                                            {!isRequesting && (
                                                <>
                                                    <span>Run</span>
                                                    <span className="create-btn__keycode">
                                                        <span className="keycode__icon keycode__icon--enter" />
                                                    </span>
                                                </>
                                            )}
                                            {isRequesting && <FormLoader />}
                                        </button>
                                    </div>
                                </div>
                            </ClickOutside>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

RunAutomationScript.displayName = 'RunAutomationScript';

RunAutomationScript.propTypes = {
    closeThisDialog: PropTypes.func,
    data: PropTypes.object,
    projectId: PropTypes.string,
    runScript: PropTypes.func,
    fetchAutomatedScript: PropTypes.func,
};

const mapDispatchToProps = dispatch =>
    bindActionCreators({ runScript, fetchAutomatedScript }, dispatch);

export default connect(null, mapDispatchToProps)(RunAutomationScript);
