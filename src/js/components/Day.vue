<template>
    <div class="calendar__row">
        <div class="calendar__row-cell"><div class="calendar__row-date">{{dayShort}}</div><div class="calendar__row-day">{{dayLiteral}}</div></div>
        <div class="calendar__row-cell calendar__row-cell--timeline">
            <div class="calendar__entry-wrap" v-for="entry in entries" v-bind:key="entry.id" v-bind:style="{ left: entry.startPercent, width: entry.endPercent }" @click.prevent="$emit('modal-open', { day: dayNum, entry })" :title="tasks[entry.userTaskId]">
                <div class="calendar__entry">
                    <span class="calendar__status-icon" v-bind:class="{'icon-exclamation-triangle': entry.status === 'warning', 'icon-tag': entry.status === 'pending', 'icon-arrow-circle-o-right': entry.status === 'active', 'icon-pencil': entry.status === 'accepted'}"></span> <strong>{{entry.duration.hours}}:{{entry.duration.minutes}}</strong> / {{tasks[entry.userTaskId]}}
                </div>
            </div>
        </div>
        <div class="calendar__row-cell"><div class="calendar__row-sum" v-if="entries.length">{{timeTotal.totalHours}}:{{timeTotal.totalMinutes}}</div><button class="calendar__edit-button" @click.prevent="$emit('modal-open', { day: dayNum, entry: {} })"><span class="calendar__edit-icon icon-pencil"></span></button></div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "Day",
        props: [ "dayNum", "entries", "tasks" ],
        computed: {
            timeTotal() {
                let totalsecs = 0;
                this.entries.filter(entry => {
                    return entry.status !== "warning";
                }).forEach(entry => {
                    totalsecs += entry.duration.hours*3600 + parseInt(entry.duration.minutes)*60 + parseInt(entry.duration.seconds);
                });
                const temphrs = Math.floor(totalsecs/3600);
                let tempmins = Math.floor((totalsecs%3600)/60);
                tempmins = tempmins < 10 ? "0"+tempmins : tempmins;
                let tempsecs = Math.floor((totalsecs%3600)%60);
                tempsecs = tempsecs < 10 ? "0"+tempsecs : tempsecs;
                return { totalHours: temphrs, totalMinutes: tempmins, totalSeconds: tempsecs };
            },
            dayLiteral() {
                return moment.utc(this.dayNum, "YYYY-MM-DD", "pl").format("dd");
            },
            dayShort() {
                return moment.utc(this.dayNum, "YYYY-MM-DD", "pl").format("DD/MM");
            }
        }
    }
</script>
