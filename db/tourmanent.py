from .models import User, Tournament, Statistic, Match_History

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