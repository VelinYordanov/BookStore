module.exports = (app, userService) => {
    app.get('/profile', async (req, res) => {
        if (!req.user) {
            return res.redirect('/login');
        }

        const { id } = req.user;

        const userData = await userService.getUserData(id);
        res.render('user/profile', userData);
    })

    app.post('/profile', async (req, res) => {
        if((req.files && req.files.profileImage)) {
            const result = await userService.addUserImage(req.files.profileImage, req.user.id);
            if(result) {
                return res.redirect('/profile');
            }
        }

        return res.redirect('/profile');
    })
}