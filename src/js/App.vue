<template>
    <div>
        <div class="calendar">
            <div class="calendar__head">
                <div class="calendar__head-cell"></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">0</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">1</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">2</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">3</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">4</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">5</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">6</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">7</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour calendar__head-hour--active">8</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour calendar__head-hour--active">9</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour calendar__head-hour--active">10</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour calendar__head-hour--active">11</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour calendar__head-hour--active">12</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour calendar__head-hour--active">13</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour calendar__head-hour--active">14</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour calendar__head-hour--active">15</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour calendar__head-hour--active">16</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour calendar__head-hour--active">17</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour calendar__head-hour--active">18</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">19</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">20</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">21</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">22</div></div>
                <div class="calendar__head-cell"><div class="calendar__head-hour">23</div></div>
                <div class="calendar__head-cell"></div>
            </div>
            <day v-for="day in days" v-bind:key="day.dayNum" v-bind="day" v-on:modal-open="modalOpen" :tasks="tasks"></day>
        </div>
        <modal v-if="editedentry.entry" v-show="modalopen" v-on:modal-close="modalClose" v-on:modal-save="modalSave" v-on:modal-delete="modalDelete" :day="editedentry.day" :entry="editedentry.entry" :tasks="tasks"></modal>
    </div>
</template>

<script>
  import Day from './components/Day.vue';
  import Modal from './components/Modal.vue';
  import axios from 'axios';
  import moment from 'moment';
  import noScroll from 'no-scroll';

  export default {
    name: "App",
    components: { Day, Modal },
    data: () => ({
      loading: true,
      fromdate: "2019-07-01",
      daycount: 10,
      tasks: [],
      entries: [],
      editedentry: {},
      modalopen: false
    }),
    computed: {

      days() {
        const out = [];
        const a = moment(this.fromdate);
        const allSeconds = 86400;

        for(let d = 0; d < this.daycount; d++) {
          const b = a.clone().add(d, "day").format("YYYY-MM-DD");
          out.push({
            dayNum: b,
            entries: this.entries.filter(task => {
              return moment(task.start).format("YYYY-MM-DD") === b;
            }).map(task => {
              const startMoment = moment(task.start).utc().diff(moment(task.start).utc().startOf('day'), 'seconds');
              const endMoment = moment(task.end).utc().diff(moment(task.end).utc().startOf('day'), 'seconds');
              return { id: task.id, taskId: task.taskId, name: task.name, start: task.start, end: task.end, status: task.status, startPercent: (startMoment*100 / allSeconds)+"%", endPercent: ((endMoment-startMoment)*100 / allSeconds)+"%" }
            })
        })
        }

        return out;
      }

    },
    mounted () {
      this.$nextTick(() => {
        const a = moment(this.fromdate);
        const b = a.clone().add(9, "day");

        let tempday = a;
        const temparr = [];

        while (tempday <= b) {
          temparr.push(tempday.format("YYYY-MM-DD"));
          tempday = tempday.clone().add(1, 'day');
        }

        this.getTasks();

      });

    },
    methods: {
      getTasks: function () {
        const tempTasks = {};

        axios.get('http://localhost:3000/userTasks')
          .then(response => {
            const tempArr = [];
            response.data.forEach(userTask => {
              tempTasks[userTask.id] = userTask.name;
              userTask.logs.forEach(log => {
                let tempLog = Object.assign({}, log);
                tempLog.name = userTask.name;
                tempLog.taskId = userTask.id;
                tempArr.push(tempLog);
              });
            });
            this.tasks = tempTasks;
            this.entries = tempArr;
            return response.data;
          })
          .catch(error => {
            console.log(error);
          });
      },

        saveTask: function (task) {
            axios.put('http://localhost:3000/userTasks/'+task.id, task, {headers: {"Content-Type": "application/json"}})
                .then(response => {
                    this.getTasks(); // todo: only get the changed usertask?
                })
                .catch(error => {
                    console.log(error);
                });
        },

        deleteTask: function (taskId) {
            axios.delete('http://localhost:3000/userTasks/'+taskId, {headers: {"Content-Type": "application/json"}})
                .then(response => {
                    this.getTasks(); // todo: only get the changed usertask?
                })
                .catch(error => {
                    console.log(error);
                });
        },

      modalOpen: function (somedata) {
        alert(somedata);
        this.editedentry = somedata;
        noScroll.on();
        this.modalopen = true;
      },

      modalClose: function () {
        noScroll.off();
        this.modalopen = false;
      },

        modalSave: function (modalData) {
            const taskId = modalData.entry.taskId;
            const taskName = modalData.entry.name;

            let newTasks = this.entries.slice(0);

            const newstart = moment(modalData.entry.start);
            const newend = moment(modalData.entry.end);
            newTasks = newTasks.filter(task => {
                return (task.id !== modalData.entry.id);
            });

            let err = false;
            newTasks.forEach(entry => {
                if(moment(entry.start).isBetween(newstart, newend) || moment(entry.end).isBetween(newstart, newend)) {
                    err = true;
                }
            });

            if(err) {
                alert("Hours overlap!");
                return;
            }

            this.modalClose();

            newTasks = newTasks.filter(task => {
                return (task.taskId === taskId);
            });

            delete modalData.entry.startPercent;
            delete modalData.entry.endPercent;

            newTasks.push(modalData.entry);

            newTasks.forEach(entry => {
                delete entry.taskId;
                delete entry.name;
            });

            const taskToSave = {
                id: taskId,
                name: taskName,
                logs: newTasks
            };

            this.saveTask(taskToSave);
        },

        modalDelete: function (modalData) {
            const taskId = modalData.entry.taskId;
            const taskName = modalData.entry.name;

            let newTasks = this.entries.slice(0);

            this.modalClose();

            newTasks = newTasks.filter(task => {
                return (task.id !== modalData.entry.id && task.taskId === taskId);
            });

            if (!newTasks.length) {
                this.deleteTask(taskId);
            } else {
                newTasks.forEach(entry => {
                    delete entry.taskId;
                    delete entry.name;
                });

                const taskToSave = {
                    id: taskId,
                    name: taskName,
                    logs: newTasks
                };

                this.saveTask(taskToSave);
            }
        }
    }
  }
</script>
