import { useAuth } from '@/src/providers/auth-provider';
import { View } from 'react-native';
import Profile from '../components/Profile';

const ProfileView = () => {
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex : 1 }}>
      {user && <Profile profileObj={user.data} onLogout={signOut} />}
    </View>
  )
}

export default ProfileView
