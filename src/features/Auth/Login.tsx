import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from 'formik';
import {ErrorStyled} from './LoginStyled';
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../../utils/reduxUtils';
import {Navigate} from 'react-router-dom';
import {selectorIsLoggedIn} from './selectors';
import {authActions} from './';
import {FormikErrorType, FormValuesType} from './Login.types';

export const Login = () => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useSelector(selectorIsLoggedIn);

    const formik = useFormik({
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'email required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'password required'
            }
            return errors;
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,  
        },
        onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<FormValuesType>) => {
            const resultAction = await dispatch(authActions.login(values));
            if (authActions.login.rejected.match(resultAction)) {
                if (resultAction.payload?.fieldsErrors?.length) {
                    const error = resultAction.payload.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field, error.error)
                }
            }
            formik.resetForm({
                values: {email: '', password: '', rememberMe: false,}
            })
        },
    })

    if (isLoggedIn) {
        return <Navigate to='/'/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target='_blank'> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label='Email'
                            margin='normal'
                            {...formik.getFieldProps('email')}
                            onBlur={formik.handleBlur}
                        />
                        {
                            formik.touched.email &&
                            formik.errors.email
                                ? <ErrorStyled>{formik.errors.email}</ErrorStyled>
                                : null
                        }
                        <TextField
                            type='password'
                            label='Password'
                            margin='normal'
                            {...formik.getFieldProps('password')}
                            onBlur={formik.handleBlur}
                        />
                        {
                            formik.touched.password &&
                            formik.errors.password
                                ? <ErrorStyled>{formik.errors.password}</ErrorStyled>
                                : null
                        }
                        <FormControlLabel
                            label={'Remember me'}
                            control={
                                <Checkbox
                                    {...formik.getFieldProps('rememberMe')}
                                    checked={formik.values.rememberMe}
                                />
                            }
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
};
