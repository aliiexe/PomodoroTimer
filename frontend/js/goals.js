function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

const user = JSON.parse(localStorage.getItem("user")) || {};
if (user._id) {
  console.log("User:", user._id);
} else {
  window.location.href = "index.html";
  console.log("User not logged in");
}

document.addEventListener('DOMContentLoaded', async () => {
  const userId = user._id;

  try {
    const goalsResponse = await axios.get(`https://backend-psi-amber-81.vercel.app/api/goals?userId=${userId}`);
    let noGoals = document.getElementById('no-goals-message');
    let goalsData = goalsResponse.data;
    const goalsContainer = document.getElementById('goals-container');

    // Sort goals by createdAt in descending order
    goalsData = goalsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if(goalsData.length === 0) {
      noGoals.classList.remove('hidden');
    }

    // Display goals
    const formatTime = (timeInSeconds) => {
      const timeInMinutes = timeInSeconds / 60;
      if (timeInMinutes < 60) {
        return `${Math.floor(timeInMinutes)} mins`;
      } else {
        return `${(timeInMinutes / 60).toFixed(2)} hrs`;
      }
    };

    // Format date to human-readable format
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Creating a div element for each goal in the goalsData array and appends it to the goalsContainer element.
    goalsData.forEach(goal => {
      const goalItem = document.createElement('div');
      goalItem.className = 'goal-item';
      goalItem.innerHTML = `
        <div>
          <h2>${goal.title}</h2>
          <p><strong>Created At:</strong> ${formatDate(goal.createdAt)}</p>
          <p><strong>Target Study Time:</strong> ${formatTime(goal.targetStudyTime)}</p>
          <p><strong>Progress:</strong> ${formatTime(goal.progress)}</p>
          <p><strong>Status:</strong> ${goal.status}</p>
          <div class="progress-bar">
            <div class="progress" style="width: ${(goal.progress / goal.targetStudyTime) * 100}%"></div>
          </div>
        </div>
        <div class="goal-actions">
          <button class="edit-btn"><i class="fas fa-edit"></i></button>
          <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        </div>
      `;
      goalsContainer.appendChild(goalItem);

      const editButton = goalItem.querySelector('.edit-btn');
      const deleteButton = goalItem.querySelector('.delete-btn');

      // Event listeners for edit and delete buttons
      editButton.addEventListener('click', () => {
        const editModal = document.getElementById('edit-modal');
        const editGoalTitle = document.getElementById('edit-goal-title');
        const confirmEditButton = document.getElementById('confirm-edit');
        editGoalTitle.value = goal.title;
        editModal.classList.remove('hidden');

        // Event listener for confirm edit button
        confirmEditButton.onclick = () => {
          const newTitle = editGoalTitle.value;
          if (newTitle) {
            axios.put(`https://backend-psi-amber-81.vercel.app/api/goals/${goal._id}`, { title: newTitle })
              .then(response => {
                goalItem.querySelector('h2').textContent = newTitle;
                console.log('Goal updated:', response.data);
                showToast('Goal updated successfully!', 'success');
                editModal.classList.add('hidden');
              })
              .catch(error => {
                console.error('Error updating goal:', error);
                showToast('Error updating goal.', 'error');
              });
          }
        };

        // Event listener for cancel edit button
        document.getElementById('cancel-edit').onclick = () => {
          editModal.classList.add('hidden');
        };
      });


      // Event listener for delete button
      deleteButton.addEventListener('click', () => {
        const deleteModal = document.getElementById('delete-modal');
        const confirmDeleteButton = document.getElementById('confirm-delete');
        deleteModal.classList.remove('hidden');

        // Event listener for confirm delete button
        confirmDeleteButton.onclick = () => {
          axios.delete(`https://backend-psi-amber-81.vercel.app/api/goals/${goal._id}`)
            .then(response => {
              goalItem.remove();
              console.log('Goal deleted:', response.data);
              showToast('Goal deleted successfully!', 'success');
              deleteModal.classList.add('hidden');
            })
            .catch(error => {
              console.error('Error deleting goal:', error);
              showToast('Error deleting goal.', 'error');
            });
        };

        // Event listener for cancel delete button
        document.getElementById('cancel-delete').onclick = () => {
          deleteModal.classList.add('hidden');
        };
      });
    });
  } catch (error) {
    // Display an error message if there's an error fetching user goals
    console.error('Error fetching user goals:', error);
    showToast('Error fetching goals.', 'error');
  }
});

// Toast notification function
function showToast(message, type) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  toastMessage.textContent = message;
  toast.className = `toast ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Event listener for close button on toast notification
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => 
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      })
    );
  });