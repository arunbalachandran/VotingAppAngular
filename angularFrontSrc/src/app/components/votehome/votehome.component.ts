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
  fruitVotes: Object[]; // change this to correct type as well
  // this is the list of all fruits apple, banana ....
  fruitsList: Object[]; // change this to the correct type
  selectedEntry: String;
  username: String;
  fruitCount: String;

  ngOnInit() {
    this.authorizationService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.username = profile.user.username;
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
      this.fruitVotes = voteData;
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

  getFruitCount(fruit) {
    console.log("Finding the count of an existing fruit " + fruit);
    console.log("Fruits votes " + JSON.stringify(this.fruitVotes));
    if (this.fruitVotes) {
      var fruitVotesString = JSON.stringify(this.fruitVotes);
      var stringIndex = fruitVotesString.indexOf(fruit);
      if (stringIndex != -1) {
        // console.log('Slice is ' + fruitVotesString.slice(stringIndex + fruit.length + 8, -2));
        var temp = JSON.parse(fruitVotesString).find(function(x) {
          return x._id == fruit;
        });
        return temp.cnt;
        // return fruitVotesString.slice(stringIndex + fruit.length + 8, fruitVotesString.length - 2);
      }
    }
    return 0;
  }

  // with change in option
  onVoteButtonClick(fruit) {
    console.log('Fruit being sent in is ' + fruit);
    this.selectedEntry = fruit;
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
        // refetch the votes count
        this.authorizationService.getVoteData().subscribe(voteData => {
          this.fruitVotes = voteData;
          console.log('Updated vote data is ' + JSON.stringify(voteData));
        },
        // observable syntax
        errorCode => {
          console.log(errorCode);
          return false;
        });
      }

      else {
        console.log("Update failed");
        this.flashMessageService.show(data.msg, {cssClass: 'alert-success', timeout: 2500});
      }
    });
  }
}
