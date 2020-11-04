
<script>
import DatepickerVuejs from 'vuejs-datepicker';

export default {
    name: 'DatePicker',
    components : {
        DatepickerVuejs
    },
    data (v) {
        console.log('data))____', v);
        return {
            disabledDates: {
                to: new Date(), // Disable all dates up to specific date
            },
        }
    },
}

</script>