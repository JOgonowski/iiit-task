<template>
    <div class="modal" @click.self="$emit('modal-close')">
        <div class="modal__window">
            <div class="modal__window-content">
                <form @submit.prevent="sendForm()">
                    <h2 class="modal__header">Dodajesz zadanie w dniu {{day}}</h2>
                    <h4 class="modal__label">Zadanie:</h4>
                    <select v-model="formData.userTaskId">
                        <option disabled value="">Wybierz zadanie...</option>
                        <option v-for="(task, id) in tasks" :value="id">{{task}}</option>
                    </select>
                    <h4 class="modal__label">Czas rozpoczęcia:</h4>
                    <div class="modal__input-group">
                        <input type="text" class="modal__input" pattern="(0[0-9]|1[0-9]|2[0-3]|[0-9])" v-model="formData.startH" /> : <input type="text" class="modal__input" pattern="([0-5][0-9])" v-model="formData.startM" /> : <input type="text" class="modal__input" pattern="([0-5][0-9])" v-model="formData.startS" />
                    </div>
                    <h4 class="modal__label">Czas zakończenia:</h4>
                    <div class="modal__input-group">
                        <input type="text" class="modal__input" pattern="(0[0-9]|1[0-9]|2[0-3]|[0-9])" v-model="formData.endH" /> : <input type="text" class="modal__input" pattern="([0-5][0-9])" v-model="formData.endM" /> : <input type="text" class="modal__input" pattern="([0-5][0-9])" v-model="formData.endS" />
                    </div>
                    <h4 class="modal__label">Status:</h4>
                    <select v-model="formData.status">
                        <option>accepted</option>
                        <option>pending</option>
                        <option>warning</option>
                        <option>active</option>
                    </select>
                    <div class="modal__button-group">
                        <button type="submit" class="modal__button">Zapisz</button>
                        <button type="button" class="modal__button modal__button--warning" v-if="formData.id" @click.prevent="$emit('modal-delete', { day, entry })">Usuń</button>
                    </div>
                </form>
            </div>
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
            if(!this.formData.status || !this.formData.userTaskId) {
                alert("Pola nie mogą być puste.");
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
                dataToSave.userTaskId = parseInt(dataToSave.userTaskId);

                this.$emit('modal-save', { day, formData: dataToSave });
            }
        }
      }
  }
</script>