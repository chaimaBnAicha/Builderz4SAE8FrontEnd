import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { LeaveService } from '../../../Service/leave.service';
import { Leave } from '../../../models/leave.model';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LeaveDetailsModalComponent } from '../leave-details-modal/leave-details-modal.component';

@Component({
  selector: 'app-leave-calendar',
  templateUrl: './leave-calendar.component.html',
  styleUrls: ['./leave-calendar.component.css']
})
export class LeaveCalendarComponent implements OnInit {
  selectedLeave: any = null;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    events: [],
    eventColor: '#3788d8',
    eventTextColor: '#ffffff',
    eventDisplay: 'block',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    },
    eventClick: this.handleEventClick.bind(this),
    eventClassNames: 'leave-event',
    height: 'auto',
    contentHeight: 'auto',
    aspectRatio: 1.8,
    dayMaxEvents: true,
    eventBorderColor: 'transparent',
    eventBackgroundColor: '#3788d8',
    eventDidMount: (info) => {
      const type = info.event.extendedProps['type'];
      let color = '#3788d8'; // default color
      
      if (type === 'Sick') {
        color = '#dc3545';
      } else if (type === 'Unpaid') {
        color = '#28a745';
      } else if (type === 'Emergency') {
        color = '#ffc107';
      }
      
      info.el.style.backgroundColor = color;
      info.el.style.borderColor = color;
      info.el.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
  };

  constructor(
    private leaveService: LeaveService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadApprovedLeaves();
  }

  handleEventClick(info: EventClickArg) {
    this.selectedLeave = {
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      reason: info.event.extendedProps['reason'],
      type: info.event.extendedProps['type'],
      status: info.event.extendedProps['status']
    };
    this.openModal();
  }

  openModal() {
    const modalRef = this.modalService.open(LeaveDetailsModalComponent, {
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.leave = this.selectedLeave;
  }

  loadApprovedLeaves() {
    this.leaveService.getLeaves().subscribe({
      next: (leaves) => {
        const approvedLeaves = leaves.filter(leave => leave.status === 'Approved');
        this.calendarOptions.events = approvedLeaves.map(leave => ({
          title: `Leave: ${leave.type}`,
          start: new Date(leave.start_date),
          end: new Date(leave.end_date),
          backgroundColor: '#28a745',
          borderColor: '#28a745',
          extendedProps: {
            reason: leave.reason,
            type: leave.type,
            status: leave.status
          }
        }));
      },
      error: (error) => {
        console.error('Error loading leaves:', error);
      }
    });
  }
} 