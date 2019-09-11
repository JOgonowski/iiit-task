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
                const a = moment.utc(this.fromdate);
                const allSeconds = 86400;

                for(let d = 0; d < this.daycount; d++) {
                    const b = a.clone().add(d, "day").format("YYYY-MM-DD");
                    out.push({
                        dayNum: b,
                        entries: this.entries.filter(entry => {
                            return moment.utc(entry.start).format("YYYY-MM-DD") === b;
                        }).map(entry => {
                            const startMoment = moment(entry.start).utc().diff(moment(entry.start).utc().startOf('day'), 'seconds');
                            const endMoment = moment(entry.end).utc().diff(moment(entry.end).utc().startOf('day'), 'seconds');
                            const diff = endMoment - startMoment;
                            const temphrs = Math.floor(diff/3600);
                            let tempmins = Math.floor((diff%3600)/60);
                            tempmins = tempmins < 10 ? "0"+tempmins : tempmins;
                            let tempsecs = Math.floor((diff%3600)%60);
                            tempsecs = tempsecs < 10 ? "0"+tempsecs : tempsecs;

                            return { id: entry.id, userTaskId: entry.userTaskId, name: entry.name, start: entry.start, end: entry.end, status: entry.status, startPercent: (startMoment*100 / allSeconds)+"%", endPercent: ((endMoment-startMoment)*100 / allSeconds)+"%", duration: { hours: temphrs, minutes: tempmins, seconds: tempsecs } }
                        })
                    })
                }

                return out;
            }

        },
        mounted () {
            this.$nextTick(() => {
                this.getTasks();
            });

        },
        methods: {
            getTasks: function () {
                axios.get('http://localhost:3000/userTasks')
                    .then(response => {
                        const tempTasks = {};
                        response.data.forEach(userTask => {
                            tempTasks[userTask.id] = userTask.name;
                        });
                        this.tasks = tempTasks;

                        axios.get('http://localhost:3000/logs')
                            .then(response => {
                                const tempArr = [];
                                response.data.forEach(log => {
                                    const tempLog = Object.assign({}, log);
                                    tempLog.name = this.tasks[log.userTaskId];
                                    tempArr.push(tempLog);
                                });
                                this.entries = tempArr;
                                return response.data;
                            })
                            .catch(error => {
                                console.log(error);
                            });

                        return response.data;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },

            modalOpen: function (entrydata) {
                this.editedentry = entrydata;
                noScroll.on();
                this.modalopen = true;
            },

            modalClose: function () {
                noScroll.off();
                this.editedentry = {};
                this.modalopen = false;
            },

            modalSave: function (modalData) {
                const newStart = moment.utc(modalData.formData.start);
                const newEnd = moment.utc(modalData.formData.end);
                const newTasks = this.entries.slice(0).filter(task => {
                    return (task.id !== modalData.formData.id);
                });

                let err = "";
                newTasks.forEach(entry => {
                    if(moment.utc(entry.start).isBetween(newStart, newEnd) || moment.utc(entry.end).isBetween(newStart, newEnd)) {
                        err += "Hours overlap with other tasks. ";
                    }
                });

                if(!newStart.isSame(newEnd, 'day')) {
                    err += "Task must begin and end in the same day. ";
                }

                if(newEnd.isSameOrBefore(newStart)) {
                    err += "Task cannot end before it begins. ";
                }

                if(err) {
                    alert(err);
                    return;
                }

                this.modalClose();

                delete modalData.formData.startPercent;
                delete modalData.formData.endPercent;

                this.saveEntry(modalData.formData);
            },

            saveEntry: function(entryData) {
                if(entryData.id) {
                    axios.put('http://localhost:3000/logs/'+entryData.id, entryData, {headers: {"Content-Type": "application/json"}})
                        .then(response => {
                            this.getTasks();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    delete entryData.id;
                    axios.post('http://localhost:3000/logs/', entryData, {headers: {"Content-Type": "application/json"}})
                        .then(response => {
                            this.getTasks();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            },

            modalDelete: function (modalData) {
                this.modalClose();

                axios.delete('http://localhost:3000/logs/'+modalData.entry.id, {headers: {"Content-Type": "application/json"}})
                    .then(response => {
                        let newEntries = this.entries.slice(0);

                        newEntries = newEntries.filter(entry => {
                            return (entry.id !== modalData.entry.id && entry.userTaskId === modalData.entry.userTaskId);
                        });

                        if (!newEntries.length) {
                            axios.delete('http://localhost:3000/userTasks/'+modalData.entry.userTaskId, {headers: {"Content-Type": "application/json"}})
                                .then(response => {
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    }).then(() => {
                    this.getTasks();
                });
            }
        }
    }
</script>
