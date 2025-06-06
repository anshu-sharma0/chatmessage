import { useForm } from "react-hook-form";
import type {SubmitHandler} from "react-hook-form";

type Inputs = {
    message: string,
};

const Chat = () => {
    const { register, reset, handleSubmit } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = data => {
        reset();
        console.log(data);
    };

    return (
        <div className="flex h-[90vh] m-8 rounded-xl border border-gray-300 overflow-hidden shadow-lg bg-white">
            {/* Sidebar */}
            <div className="w-1/4 border-r border-gray-300 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
                    <svg
                        fill="#000000"
                        height="20px"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 30 30"
                        className="cursor-pointer hover:scale-110 transition-transform"
                    >
                        <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967 C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967 s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967 c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z" />
                    </svg>
                </div>

                {/* Search */}
                <div className="px-4 py-2">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer border-b border-gray-300 last:border-b-0"
                        >
                            <img
                                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                                alt="profile"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">John Doe</p>
                                <p className="text-xs text-gray-500 truncate">Hey, how are you doing today?</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="w-3/4 flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
                    <div className="flex items-center gap-4">
                        <img
                            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <p className="text-base font-semibold text-gray-800">John Doe</p>
                    </div>
                    <svg
                        fill="#000000"
                        height="20px"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 30 30"
                        className="cursor-pointer hover:scale-110 transition-transform"
                    >
                        <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967 C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967 s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967 c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z" />
                    </svg>
                </div>

                {/* Message Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-4 space-y-4">
                    {/* Incoming Message */}
                    <div className="flex items-start gap-3">
                        <img
                            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                            alt="profile"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="bg-white px-4 py-2 rounded-xl shadow text-sm max-w-sm">
                            Hey! How’s everything going?
                        </div>
                    </div>

                    {/* Outgoing Message */}
                    <div className="flex justify-end">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow text-sm max-w-sm">
                            Doing great! Just working on the project.
                        </div>
                    </div>
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-300 px-6 py-3">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Type a message"
                            {...register("message", { required: true })}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                            type="submit"
                        >
                            Send
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Chat;
