const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Task Contract", function() {
  let TaskContract;
  let taskContract;
  let owner;

  const NUM_TOTAL_TASKS = 5;

  let totalTasks;

  beforeEach(async function() {
    TaskContract = await ethers.getContractFactory("TodoList");
    [owner] = await ethers.getSigners();
    taskContract = await TaskContract.deploy();

    totalTasks = [];

    for(let i=0; i<NUM_TOTAL_TASKS; i++) {
      let task = {
        'taskText': 'Task number:- ' + i,
        'isDeleted': false
      };

      await taskContract.AddNewTask(task.taskText, task.isDeleted);
      totalTasks.push(task);
    }
  });

  describe("Add Task", function() {
    it("should emit AddTask event", async function() {
      let task = {
        'taskText': 'New Task',
        'isDeleted': false
      };

      await expect(await taskContract.AddNewTask(task.taskText, task.isDeleted)
    ).to.emit(taskContract, 'TaskAdded').withArgs( NUM_TOTAL_TASKS,owner.address);
    })
  });

  describe("Get All Tasks", function() {
    it("should return the correct number of total tasks", async function() {
      const tasksFromChain = await taskContract.getTasks();
      expect(tasksFromChain.length).to.equal(NUM_TOTAL_TASKS);
    })
  })

  describe("Delete Task", function() {
    it("should emit delete task event", async function() {
      const TASK_ID = 0;
      const TASK_DELETED = true;

      await expect(
        taskContract.DeleteTasks(TASK_ID, TASK_DELETED)
      ).to.emit(
        taskContract, 'TaskDeleted'
      ).withArgs(
        TASK_ID
      );
    })
  })
});