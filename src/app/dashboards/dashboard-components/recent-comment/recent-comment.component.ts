import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';


@Component({
  selector: 'app-recent-comment',
  standalone: true,
  imports: [NgScrollbarModule, NgFor],
  templateUrl: './recent-comment.component.html'
})
export class RecentcommentComponent {

  
  constructor() {}

  recentcomments: any[] = [
    {
      image: 'assets/images/users/user1.jpg',
      name: 'James Anderson',
      comment:
        'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
      date: 'April 14, 2021',
      status: 'Pending',
      labelcolor: 'bg-light-info text-info'
    },
    {
      image: 'assets/images/users/user2.jpg',
      name: 'Michael Jorden',
      comment:
        'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
      date: 'April 14, 2021',
      status: 'Approved',
      labelcolor: 'bg-light-success text-success'
    },
    {
      image: 'assets/images/users/user4.jpg',
      name: 'Johnathan Doeting',
      comment:
        'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
      date: 'April 14, 2021',
      status: 'Rejected',
      labelcolor: 'bg-light-danger text-danger'
    },
    {
      image: 'assets/images/users/user5.jpg',
      name: 'James Anderson',
      comment:
        'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
      date: 'April 14, 2021',
      status: 'Pending',
      labelcolor: 'bg-light-info text-info'
    }
  ];
}
