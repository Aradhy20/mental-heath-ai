import sys
from loguru import logger
import os

def setup_logging():
    # Remove default handler
    logger.remove()
    
    # Console handler
    logger.add(
        sys.stdout, 
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level="INFO"
    )
    
    # File handler for logs (rotates at 10MB)
    log_dir = "logs"
    os.makedirs(log_dir, exist_ok=True)
    logger.add(
        os.path.join(log_dir, "prod.log"),
        rotation="10 MB",
        retention="10 days",
        level="DEBUG",
        compression="zip"
    )
    
    return logger

# Singleton instance
log = setup_logging()
