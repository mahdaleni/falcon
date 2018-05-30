import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import React, { Component } from "react";
import { FullPageLoadingIndicator } from "../../../../components/FullPageLoadingIndicator/";
import { EmptySearchResultsState } from "../../../../components/states/EmptySearchResultsState";
import { EmptyState } from "../../../../components/states/EmptyState";
import { ErrorState } from "../../../../components/states/ErrorState";
import { UserAvatar } from "../../../../components/UserAvatar";
import { getFullName } from "../../../../utils/user.util";
import { AddFacultyModal } from "../modals/AddFacultyModal";


class FacultyItem extends Component {
    render() {
        const {classes, faculty, active} = this.props;
        const {activeListItem, listItem} = classes;
        const className = active ? [activeListItem, listItem].join(" ") : listItem;
        return (
            <ListItem className={className}
                      onClick={this.props.onClick}
                      button>
                <UserAvatar user={faculty.user} />
                <ListItemText primary={getFullName(faculty.user)} />
            </ListItem>
        );
    }
}

export class FacultyList extends Component {
    state = {
        addFacultyModalIsShowing: false,
    };

    constructor(props) {
        super(props);
        const {faculties, isLoading, fetchData} = props;
        if (!faculties && !isLoading) {
            fetchData();
        }
    }

    renderLoadingIndicator = () => (
        <FullPageLoadingIndicator size={100} />
    );

    toggleAddFacultyModal = shouldShow => this.setState({
        addFacultyModalIsShowing: shouldShow,
    });

    renderEmptyState = () => (
        <EmptyState bigMessage="No faculties found"
                    smallMessage="When faculties are added, you can see them here"
                    onAddButtonClick={() => this.toggleAddFacultyModal(true)}
                    addButtonText="Add a faculty" />
    );

    renderNoResultsState = () => (
        <EmptySearchResultsState searchKeyword={this.props.searchKeyword} />
    );

    renderErrors = errors => (
        <ErrorState onRetryButtonClick={this.props.fetchData}
                    message="An error occurred while trying to fetch list of faculties."
                    debug={errors[0]}
        />
    );

    getFaculties = () => {
        let {searchKeyword, faculties} = this.props;
        if (!faculties) {
            return null;
        }
        searchKeyword = searchKeyword.toLowerCase().trim();
        if (searchKeyword.length === 0) {
            return faculties;
        }
        return faculties.filter(faculty => {
            const fullName = `${faculty.user.name.first} ${faculty.user.name.last}`.toLowerCase();
            const email = faculty.user.email.toLowerCase();
            return fullName.includes(searchKeyword) || email.includes(searchKeyword);
        });
    };

    renderList = faculties => {
        const {activeFacultyId, onFacultyClick, classes, searchKeyword} = this.props;
        const isSearching = searchKeyword.length > 0;

        if (faculties.length === 0) {
            return isSearching ? this.renderNoResultsState() : this.renderEmptyState();
        }

        return (
            <List className={classes.facultyList}>
                {faculties.map(faculty =>
                    <FacultyItem classes={classes}
                                 onClick={() => onFacultyClick(faculty)}
                                 faculty={faculty}
                                 active={activeFacultyId && activeFacultyId === faculty._id}
                                 key={faculty._id} />,
                )}
            </List>
        );
    };

    render() {
        const {classes, isLoading, errors} = this.props;
        const faculties = this.getFaculties();
        const {addFacultyModalIsShowing} = this.state;

        return (
            <Grid container className={classes.facultyListContainer}>
                {isLoading && this.renderLoadingIndicator()}
                {errors && this.renderErrors(errors)}
                {faculties && this.renderList(faculties)}

                {faculties &&
                <Tooltip title="Add a faculty" placement="top">
                    <Button variant="fab" color="primary" className={classes.addButton}
                            onClick={() => this.toggleAddFacultyModal(true)}>
                        <AddIcon />
                    </Button>
                </Tooltip>
                }

                {addFacultyModalIsShowing &&
                <AddFacultyModal open={addFacultyModalIsShowing}
                                 onClose={() => this.toggleAddFacultyModal(false)} />
                }
            </Grid>
        );
    }
}