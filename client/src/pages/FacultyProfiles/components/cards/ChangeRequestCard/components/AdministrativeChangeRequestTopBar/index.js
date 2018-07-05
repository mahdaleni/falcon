import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import React from "react";
import { UserAvatar } from "../../../../../../../components/UserAvatar";
import { SUBDOCUMENT_TYPE } from "../../../../../../../enums/faculty.enums";
import { getFullName } from "../../../../../../../utils/user.util";


export const AdministrativeChangeRequestTopBar = ({faculty, changeRequest}) => {
    const submitted = moment(changeRequest.submitted).fromNow();
    const subdocumentType = SUBDOCUMENT_TYPE[changeRequest.subdocumentType].name;
    return (
        <Toolbar>
            <Grid container direction="row" justify="space-between" alignItems="center">
                <Grid item>
                    <Grid container direction="row" alignItems="center" spacing={16}>
                        <Grid item>
                            <UserAvatar user={faculty.user} />
                        </Grid>
                        <Grid item>
                            <Typography>
                                <strong>{getFullName(faculty.user)}</strong> wants to add
                                this <strong>{subdocumentType}</strong>
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography color="textSecondary">
                        {submitted}
                    </Typography>
                </Grid>
            </Grid>
        </Toolbar>
    );
};