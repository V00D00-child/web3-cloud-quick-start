import {
    Link,
    Outlet,
    useNavigate
} from 'react-router-dom';
import { useAuth, useAuth3Token } from 'web3-cloud';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {  selectisVerified, signOutAccount } from '../auth-features/userSlice';

export default function Nav() {
  return (
    <div>
      <AuthStatus />
      <nav>
        <ul>
          <li>
            <Link to="/auth">Auth Page(Public page)</Link>
          </li>
          <li>
            <Link to="/dashboard">Your Dashboard(Protected)</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
  
function AuthStatus() {
  let auth = useAuth();
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
  const { localSignout } = useAuth3Token(); 
  const isVerified = useAppSelector(selectisVerified); 

  if (!isVerified) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      <button
        onClick={async () => {
          // Secure Auth3 - Sign out user
          const signOutResult = await auth.auth3Signout();
          if (signOutResult.authError === '' && !signOutResult.isAuthenticated) {
            localSignout();
            dispatch(signOutAccount());
            navigate('/auth', { replace: true });
          }
        }}
      >
      Sign out
      </button>
    </p>
  );
}