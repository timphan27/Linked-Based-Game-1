class Start extends Scene { //start location 
    create() {
        this.engine.hasKey = false; // initialize key
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene { //generic location
    create(key) {
        this.key = key;
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);  //display location desc
        
        if(locationData.Choices && locationData.Choices.length > 0  ) { //check if the location has any choices 
            for(let choice of locationData.Choices) { 
                this.engine.addChoice(choice.Text, choice); //pass each choice object as the 2nd parameter 
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
            if (!choice) { //if no choices exist, go to End location, showing credits
                this.engine.gotoScene(End);
                return;
            }

        //check if the user has the key if the location they want to access has the RequiresKey field
            let nextLocation = this.engine.storyData.Locations[choice.Target]; //store target location for the choice
            if (nextLocation && nextLocation.RequiresKey && !this.engine.hasKey) { //if the user does not have the key and the target location has a requiredkey field
                this.engine.show("You need a key to go there.");
                this.engine.addChoice("Go back", { Target: this.key }); //add a go back option that sends the user back to the location they were in previously
                return;
            }

             if (choice.Event == "musicBox") { //if the player inspected the music box
                let outcomes = [
                    "A faint but gloomy melody starts playing...",
                    "Absolutely nothing happens.",
                    "You hear a nasally voice from the music box. It tells you there is something of interest in the garden."
                ];

                let random = outcomes[Math.floor(Math.random() * outcomes.length)]; //generate a random index from 0 to 2. Then deref messages using that index
                this.engine.show(random);

                 this.engine.addChoice("Go back", { Target: choice.Target }); //return to the same location
                return; //do not run the normal choice case
            } 

             if (choice.Event === "getKey") {
              this.engine.hasKey = true;
              this.engine.show("You picked up a key.");

             this.engine.addChoice("Go back", { Target: choice.Target });
             return;
             }
           
            //normal choice
            if (choice.Text)    {  //check if there is valid text
            this.engine.show("&gt; "+choice.Text);
            }
            this.engine.gotoScene(Location, choice.Target); //go to target location like normal

          
         }
        }
    

class End extends Scene { //end location
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');