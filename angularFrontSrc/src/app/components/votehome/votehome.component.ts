import { Component, OnInit } from '@angular/core';
// add authorization to access vote data
import { AuthorizationService } from '../../services/authorization.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-votehome',
  templateUrl: './votehome.component.html',
  styleUrls: ['./votehome.component.css']
})

export class VotehomeComponent implements OnInit {
  constructor(private authorizationService: AuthorizationService, private flashMessageService: FlashMessagesService,
              private router: Router) { }
  
  user: Object;
  fruits: Object[]; // change this to correct type as well
  // this is the list of all fruits apple, banana ....
  fruitsList: Object[]; // change this to the correct type
  selectedEntry: String;
  username: String;
  fruitCount: String;

  // fruitIncluded(fruit) {
  //   console.log('Fruit sent in for check is ' + fruit);
  //   var result = false;
  //   console.log('Fruits are ' + this.fruits);
  //   this.fruits.map(item => {
  //     console.log('Current item is ' + JSON.stringify(item));
  //     var currentItem = JSON.parse(JSON.stringify(item));
  //     if (currentItem._id == fruit) {
  //       result = true;
  //       return;
  //     }
  //   });
  //   console.log('The value of result is ' + result);
  //   console.log('The type is ' + typeof(result));
  //   return result;
  // }

  getFruitCount(fruit) {
    console.log("Finding the count of an existing fruit " + fruit);
    // let findObj = this.fruits.find(item => JSON.parse(JSON.stringify(item))._id == fruit);
    // this.fruits.map(item => {
    //   var currentItem = JSON.parse(JSON.stringify(item));
    //   console.log('Iterating through ' + currentItem._id + ' ' + currentItem.cnt);
    //   console.log("For compare " + fruit);
    //   console.log('Type 1 is ' + typeof(currentItem._id) + ' Type 2 is ' + typeof(fruit));
    //   console.log(currentItem._id == fruit);
    //   if (currentItem._id == fruit) {
    //     console.log('There is a match for count');
    //     this.fruitCount = currentItem.cnt;
    //     return;
    //   }
    // });
    return 0;
  }

  // with change in option
  onVoteButtonClick(fruit) {
    this.selectedEntry = fruit._id;
    console.log("Selected entry is " + this.selectedEntry);
    // update the user vote (if changed)
    const userFruit = {
      username: this.username,
      fruit: this.selectedEntry
    };

    this.authorizationService.changeVote(userFruit).subscribe(data => {
      console.log("The data is " + data);
      if (data.success) {
        // find a way to add the flashMessage
        console.log("Update successful!");
        this.flashMessageService.show('Vote updated successfully!', {cssClass: 'alert-success', timeout: 2500});
      }

      else {
        console.log("Update failed");
        this.flashMessageService.show(data.msg, {cssClass: 'alert-success', timeout: 2500});
      }
    });
    // refetch the votes count
    this.authorizationService.getVoteData().subscribe(voteData => {
      this.fruits = voteData;
    },
    // observable syntax
    errorCode => {
      console.log(errorCode);
      return false;
    });
  }


  ngOnInit() {
    this.authorizationService.getProfile().subscribe(profile => {
      console.log("Getting profile data ...");
      this.user = profile.user;
      this.username = profile.user.username;
      console.log('User name is ' + JSON.stringify(this.username));
    },
    errorCode => {
      console.log(errorCode);
      return false;
    });
    
    this.authorizationService.getFruitsList().subscribe(flist => {
      this.fruitsList = flist.fruits;
      console.log('Populated fruits list successfully with' + JSON.stringify(this.fruitsList));
    },
    // observable syntax 
    // TODO : on failure, redirect user to home page
    errorCode => {
      console.log('Problem in fruits list population method ...');
      console.log(errorCode);
      return false;
    });

    this.authorizationService.getVoteData().subscribe(voteData => {
      this.fruits = voteData;
      console.log('Fetched aggregated vote data');
      console.log('Populated vote data successfully!');
    },
    // observable syntax
    errorCode => {
      console.log('Could not populate vote data');
      console.log(errorCode);
      return false;
    });
    
  }

}
