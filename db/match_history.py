from .models import User, Tournament, Statistic, Match_History

def add_match_history(user1_id, user2_id, match_date, duration=None, winner_id=None):
    try:
        # Retrieve the user objects involved in the match
        user1 = User.objects.get(id=user1_id)
        user2 = User.objects.get(id=user2_id)
        winner = User.objects.get(id=winner_id) if winner_id else None

        # Create a new match history record
        match = Match_History.objects.create(
            user1=user1,
            user2=user2,
            match_date=match_date,
            duration=duration,
            winner=winner  # Set the winner
        )
        return match
    except User.DoesNotExist:
        print(f"One of the users couldn't be found")
        return None
    except Exception as e:
        print(f"Error in adding match history: {e}")
        return None

# Function to retrieve a match history record by its ID
def get_match_history_by_id(match_id):
    try:
        # Return the match history object based on the match ID
        return Match_History.objects.get(id=match_id)
    except Match_History.DoesNotExist:
        # If the match history does not exist, print an error message
        print(f"Match history with id {match_id} not found")
        return None

# Function to update a match history record
def update_match_history(match_id, user1_id=None, user2_id=None, match_date=None, duration=None, winner_id=None):
    try:
        # Retrieve the match history object by its ID
        match = Match_History.objects.get(id=match_id)

        # Update fields if new values are provided
        if user1_id:
            match.user1 = User.objects.get(id=user1_id)
        if user2_id:
            match.user2 = User.objects.get(id=user2_id)
        if match_date:
            match.match_date = match_date
        if duration is not None:
            match.duration = duration
        if winner_id is not None:
            match.winner = User.objects.get(id=winner_id)  # Set the winner
        else:
            match.winner = None
        # Save the updated match history
        match.save()
        return match
    except Match_History.DoesNotExist:
        print(f"Match history couldn't be found")
        return None
    except User.DoesNotExist:
        print(f"One of the users couldn't be found")
        return None

# Function to delete a match history record by its ID
def delete_match_history(match_id):
    try:
        # Retrieve the match history object and delete it
        match = Match_History.objects.get(id=match_id)
        match.delete()
        return True
    except Match_History.DoesNotExist:
        # If the match history does not exist, print an error message
        print(f"Match history couldn't be found")
        return False
