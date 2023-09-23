using ExampleAPISignalR.Services;
using Microsoft.AspNetCore.SignalR;
using System.ComponentModel.DataAnnotations;

namespace ExampleAPISignalR.Hubs
{
    public class NotificationHub : Hub
    {
        private readonly NotificationService _notificationService;

        public NotificationHub(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // To detect when a user connects to the hub and add them to the group
        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "SignalRUsers");
            await Clients.Caller.SendAsync("UsersConnected");
        }


        // To detect when a user disconnects from the hub and remove them from the group
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SignalRUsers");
            var user = _notificationService.GetUserConnectionId(Context.ConnectionId);
            _notificationService.RemoveUsersFromList(user);
            await DisplayOnlineUser();
            await base.OnDisconnectedAsync(exception);
        }


        // To detect when a user connects to the hub and add them to the group by ConnectionId
        public async Task AddUserToConnectionId(string username)
        {
            _notificationService.AddUserConnectionId(username, Context.ConnectionId);
            await DisplayOnlineUser();
        }

        // invoke receive message from client and return and listen "NewMessage" to client
        public async Task ReceiveMessage(MessageDto message)
        {
            var user = _notificationService.GetUserConnectionId(Context.ConnectionId);
            await Clients.Group("SignalRUsers").SendAsync("NewMessage", message);
        }
         

        // display online users
        private async Task DisplayOnlineUser()
        {
            var onlineUsers = _notificationService.GetOnlineUsers();
            await Clients.Groups("SignalRUsers").SendAsync("OnlineUsers", onlineUsers);
        }





        // PRIVATE MESSAGE AREA

        // create private group using from and to
        private string GetPrivateGroupName(string from, string to)
        {
            // from: jhon, to: mary => jhon-mary
            var stringCompare = string.CompareOrdinal(from, to) < 0;
            return stringCompare ? $"{from}-{to}" : $"{to}-{from}";
        }



        // create private group using from and to
        public async Task CreatePrivateChat(MessageDto message)
        {
            string groupName = GetPrivateGroupName(message.From, message.To);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var toConnectionId = _notificationService.GetConnectionIdUser(message.To);
            await Groups.AddToGroupAsync(toConnectionId, groupName);

            //  open private chat for the user that is receiving the message -> To
            await Clients.Client(toConnectionId).SendAsync("OpenPrivateChat", message);
        }


        // send private message to user
        public async Task ReceivePrivateMessage(MessageDto message)
        {
            string groupName = GetPrivateGroupName(message.From, message.To);
            await Clients.Group(groupName).SendAsync("NewPrivateMessage", message);
        }


        // remove private chat
        public async Task RemovePrivateChat(MessageDto message)
        {
            string groupName = GetPrivateGroupName(message.From, message.To);
            await Clients.Group(groupName).SendAsync("ClosePrivateChat");

            // ConnectionId is from the current user -> From
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            // ConnectionId is from the user that is receiving the message -> To
            var toConnectionId = _notificationService.GetConnectionIdUser(message.To);
            await Groups.RemoveFromGroupAsync(toConnectionId, groupName);
        }
         

        public class MessageDto
        {
            [Required]
            public string From { get; set; }
            public string To { get; set; }
            [Required]
            public string Message { get; set; }
        }
    }
}
