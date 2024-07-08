import { useDrop } from "react-dnd";
import { getTask } from "../../queries/getTask";
import moment from "moment";
import { updateTask } from "../../actions/dragTask";

export default function DropRowButton({ children,row, ...props }) {
  const [{ isOver, canDrop }, drop] = useDrop(
  () => ({
      accept: 'task',
      drop: handleDrop,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  }),
  []
  )
  function formatTime(row) {
    const [hour, period] = row.split(" ");
    const time = `${hour.padStart(2, "0")}:00 ${period}`;
    return moment(time, "hh:mm A").format("HH:mm");
  }
  async function handleDrop() {
    // Get the task type
    const attributeData = event.dataTransfer.getData("text/plain").split("|");
    const type = attributeData[0];
    if (type === 'task') {
      const taskId = parseInt(attributeData[1]);
      const oldTask = await getTask(taskId)
      const start = moment(`2024-07-06T${oldTask.startTime}:00`);
      const end = moment(`2024-07-06T${oldTask.endTime}:00`);
      const diffHours = end.diff(start, "hours");
      const newStartTime = formatTime(row)
      const newEndTime = moment(`2024-07-06T${newStartTime}:00`).add(diffHours, 'hours').format('HH:mm')
      if (row === 'All Day') {
        return
      }
      await updateTask({
        id: oldTask.id,
        date: new Date(oldTask.date), 
        startTime: newStartTime,
        endTime: newEndTime
      })
    }
  }
    return (
      <button ref={drop} {...props}>
        {children}
      </button>
    );
}