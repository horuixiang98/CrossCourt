import { Activity, Trophy, Users, Zap } from "lucide-react-native";

export const icon = {
  index: (props: any) => (
    <Zap size={22} strokeWidth={2} fill={props.color} {...props} />
  ),
  club: (props: any) => (
    <Users size={22} strokeWidth={2} fill={props.color} {...props} />
  ),
  match: (props: any) => (
    <Trophy size={22} strokeWidth={2} fill={props.color} {...props} />
  ),
  stats: (props: any) => (
    <Activity size={22} strokeWidth={2} fill={props.color} {...props} />
  ),
};
