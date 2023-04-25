import React, {useState} from 'react';

export default function AskForHelpPage() {

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [taskReward, setTaskReward] = useState('');

  function handleSubmit() { }
  //   // if(username === null || videoLink === null || username === '' || videoLink === '')
  //   // {
  //   //   return ;
  //   // }

  //   const data = {
  //     username: username,
  //     taskTitle: taskTitle,
  //     taskDescription: taskDescription,
  //     taskLocation: taskLocation,
  //     taskReward: taskReward
  //   };
    
  //   fetch('https://yousub-api.nassing.tk/input', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   })
  //   .then(response => {
  //     if (response.ok) {
  //       response.text().then(text => {
  //         if(text === "0") {
  //           setUserInput('');     
  //         }
  //         else if(text === "1")
  //         {
  //           //Error
  //         }
  //       })
  //     } else {
  //       throw new Error('Error adding element');
  //     }
  //   })
  //   .catch(error => console.log(error.message)); 
  // }    


  return(
  <>
    <h1>Ask For Help</h1>
    <form className="help-form">
      <label>
        Title:
        <input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
      </label>
      <label>
        Description:
        <input type="text" value={taskDescription} onChange={e => setTaskDescription(e.target.value)} />
      </label>
      <label>
        Location:
        <input type="text" value={taskLocation} onChange={e => setTaskLocation(e.target.value)} />
      </label>
      <label>
        Reward:
        <input type="text" value={taskReward} onChange={e => setTaskReward(e.target.value)} />
      </label>
      <input onClick={() => handleSubmit()} type="submit" value="Login" />
    </form>
  </>
  )
}
