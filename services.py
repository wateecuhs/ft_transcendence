from .models import User, Tournament, Statistic, Match_History

# Function to add a new user to the database
def add_user(name, status=None, avatar=None, tournament_id=None):
    try:
        # Retrieve the related tournament if provided
        tournament = Tournament.objects.get(id=tournament_id) if tournament_id else None
        # Create a new user
        user = User.objects.create(name=name, status=status, avatar=avatar, tournament_id=tournament)
        return user
    except Exception as e:
        # Handle any exceptions during user creation
        print(f"Error in adding user: {e}")
        return None

# Function to retrieve a user by their name
def get_user_by_name(name):
    try:
        # Return the user object based on the name
        return User.objects.get(name=name)
    except User.DoesNotExist:
        # If the user does not exist, print an error message
        print(f"User with name {name} is not found")
        return None

# Function to retrieve a user by it's id
def get_user_by_id(user_id):
  try:
    return User.objects.get(id=user_id)
  except User.DoesNotExist:
    return None

# Function to update a user's information
def update_user(user_id, name=None, status=None, avatar=None, tournament_id=None):
    try:
        # Retrieve the user object by its ID
        user = User.objects.get(id=user_id)
        # Update fields if new values are provided
        if name:
            user.name = name
        if status is not None:
            user.status = status
        if avatar:
            user.avatar = avatar
        if tournament_id:
            user.tournament_id = Tournament.objects.get(id=tournament_id)
        # Save the updated user
        user.save()
        return user
    except User.DoesNotExist:
        # If the user does not exist, print an error message
        print(f"User couldn't be found")
        return None

# Function to delete a user by its ID
def delete_user(user_id):
    try:
        # Retrieve the user object and delete it
        user = User.objects.get(id=user_id)
        user.delete()
        return True
    except User.DoesNotExist:
        # If the user does not exist, print an error message
        print(f"User couldn't be found")
        return False

# Function to add a statistic record for a user
def add_statistic(name, wins, losses, playtime, user_id):
    try:
        # Retrieve the user object
        user = User.objects.get(id=user_id)
        # Create a new statistic record for the user
        stat = Statistic.objects.create(name=name, wins=wins, losses=losses, playtime=playtime, user_id=user)
        return stat
    except User.DoesNotExist:
        # If the user does not exist, print an error message
        print(f"User couldn't be found in adding statistic")
        return None

# Function to retrieve a statistic record based on the user's ID
def get_stat_by_user_id(user_id):
    try:
        # Return the statistic object based on the user's ID
        return Statistic.objects.get(user_id=user_id)
    except Statistic.DoesNotExist:
        # If the statistic does not exist, print an error message
        print(f"Stat couldn't be found with user_id {user_id}")
        return None

# Function to update a statistic record for a user
def update_statistic(user_id, name=None, wins=None, losses=None, playtime=None):
    try:
        # Retrieve the statistic object by the user's ID
        stat = Statistic.objects.get(user_id=user_id)
        # Update fields if new values are provided
        if name:
            stat.name = name
        if wins is not None:
            stat.wins = wins
        if losses is not None:
            stat.losses = losses
        if playtime is not None:
            stat.playtime = playtime
        # Save the updated statistic
        stat.save()
        return stat
    except Statistic.DoesNotExist:
        # If the statistic does not exist, print an error message
        print(f"Stat couldn't be found")
        return None

# Function to delete a statistic record by the user's ID
def delete_statistic(user_id):
    try:
        # Retrieve the statistic object and delete it
        stat = Statistic.objects.get(user_id=user_id)
        stat.delete()
        return True
    except Statistic.DoesNotExist:
        # If the statistic does not exist, print an error message
        print(f"Stat couldn't be found with user_id {user_id}")
        return False

# Function to add a new tournament to the database
def add_tournament(name, start_date=None, end_date=None, duration=None):
    try:
        # Create a new tournament
        tournament = Tournament.objects.create(name=name, start_date=start_date, end_date=end_date, duration=duration)
        return tournament
    except Exception as e:
        # Handle any exceptions during tournament creation
        print(f"Error in adding tournament: {e}")
        return None

# Function to retrieve a tournament by its name
def get_tournament_by_name(name):
    try:
        # Return the tournament object based on the name
        return Tournament.objects.get(name=name)
    except Tournament.DoesNotExist:
        # If the tournament does not exist, print an error message
        print(f"Tournament with name {name} not found")
        return None

# Function to update a tournament's details
def update_tournament(tournament_id, name=None, start_date=None, end_date=None, duration=None):
    try:
        # Retrieve the tournament object by its ID
        tournament = Tournament.objects.get(id=tournament_id)
        # Update fields if new values are provided
        if name:
            tournament.name = name
        if start_date:
            tournament.start_date = start_date
        if end_date:
            tournament.end_date = end_date
        if duration is not None:
            tournament.duration = duration
        # Save the updated tournament
        tournament.save()
        return tournament
    except Tournament.DoesNotExist:
        # If the tournament does not exist, print an error message
        print(f"Tournament couldn't be found")
        return None

# Function to delete a tournament by its ID
def delete_tournament(tournament_id):
    try:
        # Retrieve the tournament object and delete it
        tournament = Tournament.objects.get(id=tournament_id)
        tournament.delete()
        return True
    except Tournament.DoesNotExist:
        # If the tournament does not exist, print an error message
        print(f"Tournament couldn't be found")
        return False

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
        if winner_id:
            match.winner = User.objects.get(id=winner_id)  # Set the winner

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
