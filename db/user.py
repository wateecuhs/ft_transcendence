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