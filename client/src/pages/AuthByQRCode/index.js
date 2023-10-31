import React from 'react';
import { authByQRCodeRequest, emptyUserObjectRequest } from '../../actions/actionCreator';
import { connect } from 'react-redux';

const AuthByQRCode = (props) => {
    props.emptyUserObjectRequest();
    const refresh = new URLSearchParams(window.location.search).get('refresh');
    props.authByQRCodeRequest(refresh);
    return (
        <h1>
            Please wait.....
        </h1>
    );
}

const mapDispatchToProps = {
    authByQRCodeRequest,
    emptyUserObjectRequest
}

export default connect(null, mapDispatchToProps)(AuthByQRCode);

/*

http://192.168.3.12:3000/authByQR/?refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTFkOTFhNmRmYmYwNWEzYWRiZmQ0NWQiLCJlbWFpbCI6InBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE2OTg2ODgzNDIsImV4cCI6MTY5ODY5MTk0Mn0.pDx7lfsYygTsY_mHMRW0GOhZhhRgY18bc0xOBPU_egs

*/