<template>
    <div class="calendar__row">
        <div class="calendar__row-cell"><div class="calendar__row-date">01/04</div><div class="calendar__row-day">CZ</div></div>
        <div class="calendar__row-cell calendar__row-cell--timeline">
            <div class="calendar__entry-wrap" v-for="entry in entries" v-bind:key="entry.id" v-bind:style="{ left: entry.startPercent, width: entry.endPercent }" @click.prevent="$emit('modal-open', { day: dayNum, entry })">
                <div class="calendar__entry">
                    <span class="calendar__status-icon icon-exclamation-triangle"></span> <strong>{{entry.taskId}} {{entry.id}} {{entry.duration.hours}}:{{entry.duration.minutes}}:{{entry.duration.seconds}}</strong> / {{tasks[entry.taskId]}}
                </div>
            </div>
        </div>
        <div class="calendar__row-cell"><div class="calendar__row-sum" v-if="entries.length">{{timeTotal.totalHours}}:{{timeTotal.totalMinutes}}</div><button class="calendar__edit-button" @click.prevent="$emit('modal-open', { day: dayNum })"><span class="calendar__edit-icon icon-pencil"></span></button></div>
    </div>
</template>

<script>
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
            }
        }
    }
</script>
