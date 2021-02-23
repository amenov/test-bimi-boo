new Vue({
  el: '#app',
  data: {
    initialForm: {
      title: '',
      description: '',
      platform: '',
      downloads: '',
      revenue: '',
      date: '',
    },
    modalCreateRecord: {},
    form: {},
    errors: {},
    records: [],
    recordIds: [],
  },
  methods: {
    bootstrap() {
      this.form = { ...this.initialForm };
    },
    resetForm() {
      this.errors = {};

      this.bootstrap();
    },
    validateForm(request, rules) {
      const errors = {};

      Object.keys(rules).forEach((key) => {
        if (rules[key] === 'required') {
          if (!request[key]) {
            errors[key] = rules[key];
          }
        }
      });

      const failed = !!Object.keys(errors).length;

      if (failed) {
        alert('Check the form for errors!');
      }

      return failed ? errors : false;
    },
    createRecord() {
      const errors = this.validateForm(this.form, {
        title: 'required',
        description: 'required',
        platform: 'required',
        downloads: 'required',
        revenue: 'required',
        date: 'required',
      });

      if (!errors) {
        this.records.push({
          id: this.recordIds.length + 1,
          ...this.form,
        });

        this.recordIds.push(this.recordIds.length + 1);

        this.resetForm();

        this.modalCreateRecord.hide();
      } else {
        this.errors = errors;
      }
    },
    updateRecord(id, data, modalUpdateRecord) {
      const errors = this.validateForm(data, {
        title: 'required',
        description: 'required',
        platform: 'required',
        downloads: 'required',
        revenue: 'required',
        date: 'required',
      });

      if (!errors) {
        const yes = confirm('Do you really want to apply the changes?');

        if (yes) {
          const record = this.records.find((record) => record.id === id);

          if (record) {
            Object.assign(record, data);

            modalUpdateRecord.hide();
          }
        }
      } else {
        return errors;
      }
    },
    deleteRecord(id) {
      const yes = confirm('Are you sure you want to delete the entry?');

      if (yes) {
        this.records = this.records.filter((record) => record.id !== id);
      }
    },
  },
  mounted() {
    this.modalCreateRecord = new bootstrap.Modal(
      document.getElementById('modal-create-record')
    );

    this.bootstrap();
  },
});

Vue.component('form-fields', {
  props: ['form', 'errors'],
  template: `
    <form>
        <div class="mb-3">
            <label for="form-create-record-title" class="form-label">Title</label>
            <input type="text" class="form-control" :class="{'form-control--error':errors.title}" id="form-create-record-title" v-model="form.title"/>
        </div>
        <div class="mb-3">
            <label for="form-create-record-description" class="form-label">Description</label>
            <textarea class="form-control" :class="{'form-control--error':errors.description}" id="form-create-record-description" v-model="form.description" rows="3"></textarea>
        </div>
        <div class="mb-3">
            <label for="form-create-record-platform" class="form-label">Platform</label>
            <input type="text" class="form-control" :class="{'form-control--error':errors.platform}" id="form-create-record-platform" v-model="form.platform"/>
        </div>
        <div class="mb-3">
            <label for="form-create-record-downloads" class="form-label">Downloads</label>
            <input type="number" class="form-control" :class="{'form-control--error':errors.downloads}" id="form-create-record-downloads" v-model.number="form.downloads"/>
        </div>
        <div class="mb-3">
            <label for="form-create-record-revenue" class="form-label">Revenue</label>
            <input type="text" class="form-control" :class="{'form-control--error':errors.revenue}" id="form-create-record-revenue" v-model="form.revenue"/>
        </div>
        <div class="mb-3">
            <label for="form-create-record-date" class="form-label">Date</label>
            <input type="date" class="form-control" :class="{'form-control--error':errors.date}" id="form-create-record-date" v-model="form.date"/>
        </div>
    </form>
    `,
});

Vue.component('modal-update-record', {
  props: ['data', 'updateRecord'],
  data: () => ({
    modalUpdateRecord: {},
    form: {},
    errors: {},
  }),
  template: `
    <div class="modal fade" :id="'modal-update-record-' + data.id" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Update record</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form-fields :form="form" :errors="errors"></form-fields>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="update">Update</button>
                </div>
            </div>
        </div>
    </div>
    `,
  methods: {
    update() {
      const errors = this.updateRecord(
        this.data.id,
        this.form,
        this.modalUpdateRecord
      );

      if (errors) {
        this.errors = errors;
      } else {
        this.errors = {};
      }
    },
  },
  mounted() {
    this.modalUpdateRecord = new bootstrap.Modal(
      document.getElementById('modal-update-record-' + this.data.id)
    );

    this.form = { ...this.data };
  },
});
