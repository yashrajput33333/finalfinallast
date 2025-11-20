export const authorize = (...roles) => {
    console.log("Roles in authorize middleware:", roles);
  
  return (req, res, next) => {
    
    if (!req.user) {
          console.log("User in request:", req.user);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }
      console.log("User in request:", req.user);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};
