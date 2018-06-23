import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom";
import compose from "recompose/compose";
import { subjectIsAdded } from "../../../../../redux/actions/subject.actions";
import { toastIsShowing } from "../../../../../redux/actions/toast.actions";
import { addSubject } from "../../../../../services/subjects.service";
import { fetchAllFaculties } from "../../../../../utils/faculty.util";
import { AddSubjectModal as Component } from "./AddSubjectModal";
import { styles } from "./styles";


const mapStateToProps = state => ({
    ...state.faculty,
});

const mapDispatchToProps = dispatch => ({
    showToast(message) {
        dispatch(toastIsShowing(message));
    },

    fetchData() {
        fetchAllFaculties(dispatch);
    },

    submitAddSubject(form) {
        return addSubject(form)
            .then(result => {
                const subject = result.data.subject.add;
                dispatch(subjectIsAdded(subject));
                return subject;
            });
    },
});

export const AddSubjectModal = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles),
    withRouter,
)(Component);