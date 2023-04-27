import React, { useState } from 'react';

export default function HelpPage() {

  const [taskList, setTaskList] = useState([{title: "title", description: "description", user: "user", userProfilePicture: "linkToPicture", taskImage: "linkToImage", location: "location", postDate: "date", reward: "reward", status: "status"}, {title: "title", description: "description", user: "user", userProfilePicture: "linkToPicture", taskImage: "linkToImage", location: "location", postDate: "date", reward: "reward", status: "status"}]);

  const getTaskList = () => {
    fetch('http://localhost:4859/getTasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json;
      }
      else {
        throw new Error('Something went wrong ...');
      }
    })
    .then(data => {
          setTaskList(data);
        })
    .catch(error => console.log(error.message));
  }

  getTaskList();

  return(
    <>
      <div className="task-list">
        {taskList.map((task, index) => (
          <div className="task" key={index}>
            <div className="task-user-info">
              <p>{task.user}</p>
              <p>{task.userProfilePicture}</p>
            </div>

            <div className="task-title">
              <h1>{task.title}</h1>
            </div>
            
            <div className="task-description">
              <p>{task.description}</p>
            </div>
            
            <div className="task-image">
              <p>{task.taskImage}</p>
            </div>

            <div className="task-other-info">
              <p>{task.location}</p>
              <p>{task.postDate}</p>
              <p>{task.reward}</p>
              <p>{task.status}</p>
            </div>
           </div>
        ))}
      </div>
    </>
  );
}