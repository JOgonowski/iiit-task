<template>
    <div class="calendar__row">
        <div class="calendar__row-cell"><div class="calendar__row-date">01/04</div><div class="calendar__row-day">CZ</div></div>
        <div class="calendar__row-cell calendar__row-cell--timeline">
            <div class="calendar__entry-wrap" v-for="entry in entries" v-bind:key="entry.id" v-bind:style="{ left: entry.startPercent, width: entry.endPercent }" @click.prevent="$emit('modal-open', { day: dayNum, entry })">
                <div class="calendar__entry">
                    <span class="calendar__status-icon icon-exclamation-triangle"></span> <strong>{{entry.id}} 3:50</strong> / {{tasks[entry.taskId]}}
                </div>
            </div>
        </div>
        <div class="calendar__row-cell"><div class="calendar__row-sum">8:20</div><button class="calendar__edit-button" @click.prevent="$emit('modal-open', { day: dayNum })"><span class="calendar__edit-icon icon-pencil"></span></button></div>
    </div>
</template>

<script>
  export default {
    name: "Day",
    props: [ "dayNum", "entries", "tasks" ]
  }
</script>
