import React from "react";

export const Note = (props) => {
    return (
        <div id="profile-div">
            <p><strong>TargetWorkloadId: </strong> {props.apiOutput.TargetWorkloadId}</p>
            <p><strong>Team: </strong> {props.apiOutput.Team}</p>
            <p><strong>Routing: </strong> {props.apiOutput.Routing}</p>
            <p><strong>{props.message}</strong></p>
        </div>
    );
};