import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("http://ubeer-api/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated ? (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        {profileData && <pre>{JSON.stringify(profileData, null, 2)}</pre>}
      </div>
    ) : (
      <div>
        <h2>Not Logged In</h2>
      </div>
    )
  );
};

export default Profile;
