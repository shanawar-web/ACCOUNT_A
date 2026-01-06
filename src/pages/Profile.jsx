
import { useContext } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            <div className="bg-white p-6 rounded shadow max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Name:</label>
                    <p className="text-gray-900">{user?.name}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Role:</label>
                    <p className="text-gray-900 capitalize">{user?.role}</p>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
