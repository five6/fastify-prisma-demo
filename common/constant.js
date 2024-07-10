export default {
    USER_NAME_REGEX: /^[a-zA-Z_][a-zA-Z0-9_]*([.][a-zA-Z0-9_]+)*$/,
    UserTypeEnum: {
        Admin: 0,
        Member: 1,
        SuperAdmin: 999,
    },
    SexEnum: {
        Man: 0,
        WoMan: 1,
    },
    MenuEnum: {
        Directory: 1,
        Menu: 2,
        Btn: 3,
    },
    RoleTypeEnum: {
        SYSTEM: 1,
        CUSTOM: 2,
    },
    CommonStatusEnum: {
        ENABLE: 1,
        DISABLE: 0,
    },
    MemberTypeEnum: {
        WECHAT: '1', // 小程序用户
        ROBOT: '2', // 机器人
    },
    // game io event
    GAME_INTERFACE: {
        GAME_START: 'GAME_START',
        GAME_END: 'GAME_END',
    }
}