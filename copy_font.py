import shutil
import os

src = r'C:\Users\AlfarabiMaken\PycharmProjects\wedding\PassionsConflictRUS-Regular.otf'
dst_dir = r'C:\Users\AlfarabiMaken\PycharmProjects\wedding\static\fonts'

os.makedirs(dst_dir, exist_ok=True)
shutil.copy(src, os.path.join(dst_dir, 'PassionsConflictRUS-Regular.otf'))
print("Font copied successfully")
