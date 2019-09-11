<template>
    <div class="modal" @click.self="$emit('modal-close')">
        <div class="modal__window">
            <form @submit.prevent="sendForm()">
                <h2>Dodajesz task do dnia {{day}}</h2>
                <h4>Zadanie:</h4>
                <select v-model="formData.userTaskId">
                    <option disabled value="">Wybierz zadanie...</option>
                    <option v-for="(task, id) in tasks" :value="id">{{task}}</option>
                </select>
                <h4>Czas rozpoczęcia:</h4>
                <input type="text" pattern="([0-9]|0[0-9]|1[0-9]|2[0-3])" v-model="formData.startH" />:<input type="text" pattern="([0-5][0-9])" v-model="formData.startM" />:<input type="text" pattern="([0-5][0-9])" v-model="formData.startS" />
                <h4>Czas zakończenia:</h4>
                <input type="text" pattern="([0-9]|0[0-9]|1[0-9]|2[0-3])" v-model="formData.endH" />:<input type="text" pattern="([0-5][0-9])" v-model="formData.endM" />:<input type="text" pattern="([0-5][0-9])" v-model="formData.endS" />
                <h4>Status:</h4>
                <select v-model="formData.status">
                    <option>accepted</option>
                    <option>pending</option>
                    <option>warning</option>
                    <option>active</option>
                </select>
                <button type="submit">save</button>
                <button v-if="formData.id" @click.prevent="$emit('modal-delete', { day, entry })">delete</button>
            </form>
            <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ullamcorper dictum enim ac molestie. Curabitur est libero, tempor eu interdum in, luctus in tortor. Cras vitae quam sed leo eleifend volutpat. Donec eget viverra orci. In euismod erat vitae lorem auctor facilisis. Donec sed ultricies diam. Pellentesque magna diam, condimentum sit amet tellus id, cursus accumsan velit. Phasellus tincidunt consequat dolor, in faucibus metus vehicula id. Morbi quis odio ultrices, vestibulum mauris vitae, tempus nulla. Donec interdum tortor id dui blandit, eu sollicitudin ex sollicitudin. Mauris viverra neque tellus, et volutpat ligula convallis ac. Nullam nisl nulla, viverra in vulputate vel, consequat eu est. In commodo ornare lacus non facilisis. Suspendisse nisi velit, mollis a euismod non, cursus ut nulla. Pellentesque et purus sed neque varius condimentum.<br />
                <br />
                Pellentesque quis elementum magna, vel rhoncus dui. Nunc eu ante nibh. Phasellus lobortis nibh sed feugiat finibus. Duis sollicitudin aliquam augue nec ultricies. Praesent et nulla auctor, aliquam turpis in, aliquam magna. Aenean eu elementum ante. Quisque lobortis lorem ut massa posuere gravida. Nullam luctus cursus urna non suscipit. Curabitur porttitor elementum nunc. In lacinia sed leo sit amet rhoncus. Ut eget posuere odio, sit amet vestibulum nisl. Curabitur condimentum malesuada tellus, vel viverra tellus auctor sit amet.<br />
                <br />
                Cras eu pretium mauris. Maecenas consectetur sollicitudin lectus, fermentum maximus enim placerat in. Nullam in ultricies erat, eu finibus metus. Integer fermentum tortor nec arcu gravida, sit amet tempor dolor pellentesque. Aliquam dapibus laoreet posuere. Nulla maximus risus nec lacus eleifend faucibus. Sed eu bibendum purus. Vivamus eu sem ac sapien ornare placerat. Nulla facilisi.<br />
                <br />
                Aliquam lorem lorem, aliquet porta lorem vel, malesuada pulvinar eros. Cras tincidunt volutpat felis, sed lacinia lectus tempor nec. Vivamus id enim eu nunc gravida imperdiet. Mauris tristique est odio. Sed fermentum elit velit, quis accumsan augue efficitur quis. Maecenas arcu turpis, pretium nec accumsan sed, malesuada rutrum velit. Sed ac blandit odio. Integer vehicula nunc turpis. Integer tincidunt sem efficitur velit egestas vehicula. In aliquet molestie odio ut venenatis. Integer sed mauris nunc. Vivamus rutrum lacinia leo, ut egestas metus consequat sed. Phasellus nec vehicula elit.<br />
                <br />
                Curabitur sollicitudin maximus vehicula. Vestibulum dolor risus, varius volutpat mauris id, varius aliquet mauris. Aenean sodales rhoncus justo a egestas. Fusce rhoncus bibendum elit, maximus pellentesque tellus bibendum vel. Pellentesque tortor enim, laoreet vestibulum sodales a, lobortis sed felis. Nam venenatis quam lacus, sit amet condimentum tellus accumsan vitae. Sed euismod, dolor dignissim auctor lacinia, orci quam ultricies lorem, a gravida metus massa in tellus. Sed non volutpat nisi. Sed condimentum ligula nulla, vitae mattis lectus ullamcorper vitae.</h1>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

  export default {
    name: "Modal",
    props: [ "day", "entry", "tasks" ],
      computed: {
        formData() {
            return {
                id: this.entry.id,
                startH: moment.utc(this.entry.start).format("H"),
                startM: moment.utc(this.entry.start).format("mm"),
                startS: moment.utc(this.entry.start).format("ss"),
                endH: moment.utc(this.entry.end).format("H"),
                endM: moment.utc(this.entry.end).format("mm"),
                endS: moment.utc(this.entry.end).format("ss"),
                status: this.entry.status,
                userTaskId: this.entry.userTaskId
            };
        }
      },
      methods: {
        sendForm: function() {
            if(!this.formData.status) {
                alert("Some data is missing.");
            } else {
                const day = this.day;
                const formData = this.formData;
                const startSeconds = 3600*parseInt(this.formData.startH) + 60*parseInt(this.formData.startM) + parseInt(this.formData.startS);
                const endSeconds = 3600*parseInt(this.formData.endH) + 60*parseInt(this.formData.endM) + parseInt(this.formData.endS);
                formData.start = moment.utc(day).add(startSeconds, "seconds").format();
                formData.end = moment.utc(day).add(endSeconds, "seconds").format();
                const dataToSave = Object.assign({}, formData);
                delete dataToSave.startH;
                delete dataToSave.startM;
                delete dataToSave.startS;
                delete dataToSave.endH;
                delete dataToSave.endM;
                delete dataToSave.endS;

                this.$emit('modal-save', { day, formData: dataToSave });
            }
        }
      }
  }
</script>