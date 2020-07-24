import React, { useEffect } from 'react';
import Axios from 'axios';
import {useDispatch} from 'react-redux';
import {auth} from '../_action/user_action'

export default function(SpecificComponent, option, adminRoute = null){
    //null => can access everybody
    //true => can access logged in user
    //false => cannot access logged in user (ex. login page etc..)

    function AuthenticationCheck(props){

        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then(response =>{
                console.log(response)

                //condition before log in
                if(!response.payload.isAuth){
                    if(option){
                        props.history.push(`/login`)
                    }
                }else{
                    //condition after log in
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/')
                    }else{
                        if(option == false){
                            props.history.push('/')
                        }
                    }
                }
            })

        }, [])

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}