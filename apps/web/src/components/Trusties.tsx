import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "./ui/avatar.tsx"

export function Trusties() {
    return (
        <div className="flex flex-row flex-wrap items-center">
            <Avatar>
                <AvatarImage
                    src="https://images.pexels.com/photos/20181989/pexels-photo-20181989.jpeg?_gl=1*4owpgt*_ga*NjIyNzg1NjcuMTc3OTAxMjg2Nw..*_ga_8JE65Q40S6*czE3OTQ3ODk1NTQkbzUkZzEkdDE3OTQ3ODk1NTgkajU2JGwwJGgw"
                    alt="@shadcn"

                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarImage
                    src="https://images.pexels.com/photos/7549564/pexels-photo-7549564.jpeg"
                    alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
                <AvatarBadge className="bg-blue-500 ring-2 ring-landing-bg" />
            </Avatar>
            <AvatarGroup className="    ">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarImage
                        src="https://github.com/maxleiter.png"
                        alt="@evilrabbit"
                    />
                    <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarImage
                        src="https://images.pexels.com/photos/11576669/pexels-photo-11576669.jpeg   "
                        alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+3</AvatarGroupCount>
            </AvatarGroup>
        </div>
    )
}
