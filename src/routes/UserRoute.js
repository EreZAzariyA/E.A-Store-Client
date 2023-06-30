import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdmin } from '../utils/helpers';
import { useEffect } from 'react';
import { message } from 'antd';
import { AuthActions } from '../redux/actions';

export const UserRoute = ({ children }) => {
  let location = useLocation();
  const dispatch = useDispatch();
  const user  = useSelector((state) => (state.authReducer?.user));

  useEffect(() => {
    if (user && isAdmin(user) && !process.env.REACT_APP_IS_ADMIN) {
      message.error('You are admin. You are not in the correct url')
      dispatch(AuthActions.logout());
    };
  }, [dispatch, location, user]);

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  };

  return children;
};
