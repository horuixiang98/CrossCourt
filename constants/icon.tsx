import { Feather } from "@expo/vector-icons";

export const icon = {
    index: (props: any) => <Feather name={'home'} size={20} {... props}/>,
    training: (props: any) => <Feather name={'loader'} size={20} {... props} />,
    profile: (props: any) => <Feather name={'settings'} size={20} {... props}/>,
}
