from .models import User, Tournament, Statistic, Match_History

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