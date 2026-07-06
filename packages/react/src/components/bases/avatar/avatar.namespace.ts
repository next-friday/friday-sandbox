import {
  Avatar as AvatarBase,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
} from "./avatar";

export const Avatar = Object.assign(AvatarBase, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Group: AvatarGroup,
});
