pragma solidity ^0.8.19;

contract TaskTurtle {

    struct Task {
        uint id;
        address requester;
        address performer;
        uint price;
        bool completed;
    }

    Task[] public tasks;
    mapping(uint => bool) public taskExists;
    address escroWallet = 0xdF0987Eab5cEa97151e5cB42A61dD7D8D752ef37;

    event TaskCreated(uint taskId, address requester, uint price);
    event TaskAccepted(uint taskId, address performer);
    event TaskCompleted(uint taskId, address performer);
    event PaymentReleased(uint taskId, address performer);

    function createTask(uint _taskId, uint _price) public {
        require(!taskExists[_taskId], "Task with this id already exists");

        Task memory newTask = Task({
            id: _taskId,
            requester: msg.sender,
            performer: address(0),
            price: _price,
            completed: false
        });

        tasks.push(newTask);
        taskExists[_taskId] = true;

        emit TaskCreated(_taskId, msg.sender, _price);
    }

    function acceptTask(uint _taskId) public payable {
        require(taskExists[_taskId], "Task with this id does not exist");
        Task storage task = tasks[_taskId];

        require(!task.completed, "Task already completed");
        require(task.performer == address(0), "Task already accepted by a performer");
        require(msg.value == task.price, "Incorrect payment amount");

        task.performer = msg.sender;

        emit TaskAccepted(_taskId, msg.sender);
    }

    function completeTask(uint _taskId) public {
        require(taskExists[_taskId], "Task with this id does not exist");
        Task storage task = tasks[_taskId];

        require(task.performer == msg.sender, "Only the performer can complete the task");
        require(!task.completed, "Task already completed");

        task.completed = true;

        emit TaskCompleted(_taskId, msg.sender);
    }

    function releasePayment(uint _taskId) public {
        require(taskExists[_taskId], "Task with this id does not exist");
        Task storage task = tasks[_taskId];

        require(task.requester == msg.sender, "Only the requester can release the payment");
        require(task.completed, "Task not completed");

        payable(task.performer).transfer(task.price);

        emit PaymentReleased(_taskId, task.performer);
    }

    function sayHello() external pure returns (string memory) {
        return "You are indeed connected to the BlockChain ! Congrats !";
    }
}
