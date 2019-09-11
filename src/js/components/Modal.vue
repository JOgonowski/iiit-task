<template>
    <div class="modal" @click.self="$emit('modal-close')">
        <div class="modal__window">
            <form @submit.prevent="sendForm()">
                <h2>Dodajesz task do dnia {{day}}</h2>
                <input type="text" v-model="formData.userTaskId" />
                <input type="text" v-model="formData.id" />
                <input type="text" v-model="formData.name" />
                <input type="text" v-model="formData.start" />
                <input type="text" v-model="formData.end" />
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
  export default {
    name: "Modal",
    props: [ "day", "entry", "tasks" ],
      computed: {
        formData() {
            return {
                id: this.entry.id,
                name: this.entry.name,
                start: this.entry.start,
                end: this.entry.end,
                status: this.entry.status,
                userTaskId: this.entry.userTaskId
            };
        }
      },
      methods: {
        sendForm: function() {
            if(!this.formData.userTaskId && !this.formData.name) {
                alert("You must specify a name for the new task.");
            } else if(!this.formData.status) {
                alert("Some data is missing.");
            } else {
                const day = this.day;
                const formData = this.formData;
                this.$emit('modal-save', { day, formData });
            }
        }
      }
  }
</script>