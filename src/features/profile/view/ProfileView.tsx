import { useAuth } from '@/src/providers/auth-provider';
import { View } from 'react-native';
import Profile from '../components/Profile';

const ProfileView = () => {
  const { user } = useAuth();

  return (
    <View style={{ flex : 1 }}>
      {user && <Profile profileObj={user.data} />}
    </View>
  )
}

export default ProfileView
