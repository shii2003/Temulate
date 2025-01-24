import React from 'react';
import OnlineUserInfo from './OnlineUserInfo';

type OnlineUsersListProps = {

};
const users = [
    { id: 1, name: 'Masaooooooooooo', email: 'masao@example.com', imageSrc: '/masao.jpg' },
    { id: 2, name: 'John Doe', email: 'john@example.com', imageSrc: '/john.jpg' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', imageSrc: '/jane.jpg' },
];

const OnlineUsersList: React.FC<OnlineUsersListProps> = () => {

    return (
        <div className="flex gap-1 justify-start">
            {users.map((user) => (
                <OnlineUserInfo
                    key={user.id}
                    username={user.name}
                    email={user.email}
                />
            ))}
        </div>
    )
}
export default OnlineUsersList;