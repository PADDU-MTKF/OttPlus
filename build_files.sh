echo " BUILD START"
python3 -m pip3 install -r requirements.txt
python3 manage.py collectstatic --noinput --clear
echo " BUILD END"
